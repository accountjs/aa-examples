import { useEffect, useState } from "react"
import {
  Button,
  Description,
  Dot,
  Grid,
  Page,
  Text,
  Textarea,
  useToasts,
} from "@geist-ui/core"
import Head from "next/head"
import useEvent from "react-use-event-hook"
import { genPrivKey } from "maci-crypto"
// @ts-expect-error there is no typing for circomlibjs yet
import { eddsa, smt } from "circomlibjs"
import { PrivateRecoveryAccount__factory } from "@accountjs/contracts"
import { useAbstractAccount } from "@/hooks/useAbstractAccount"
import { LOCAL_CONFIG } from "@/config"
import AppLayout from "../components/AppLayout"
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard"

type KeyPair = { privateKey: string; publicKey: BigInt[] }

const generateKeyPair = (): KeyPair => {
  const privateKey = genPrivKey().toString()
  const publicKey = eddsa.prv2pub(privateKey) as [BigInt, BigInt]
  return {
    privateKey,
    publicKey,
  }
}

const { updateGuardianVerifier, socialRecoveryVerifier, poseidon } =
  LOCAL_CONFIG

const Guardian = () => {
  const {
    accountAddress,
    eoaAddress: ownerAddress,
    aaProvider,
  } = useAbstractAccount()

  const [keyPairs, setKeyPairs] = useState<string>()
  const [guardians, setGuardians] = useState<string[]>()
  const [isInitializing, setIsInitializing] = useState(false)

  useEffect(() => {
    if (!accountAddress || !aaProvider) {
      return
    }

    ;(async () => {
      const accountContract = PrivateRecoveryAccount__factory.connect(
        accountAddress,
        aaProvider
      )
      const guardians = await accountContract
        .getGuardians()
        .then((xs) => xs.map((x) => x.toString()))
      setGuardians(guardians)
    })()
  }, [aaProvider, accountAddress, isInitializing])

  const handleSetupGuardians = useEvent(async (publicKeys: BigInt[]) => {
    const account = aaProvider?.smartAccountAPI
    const accountAddress = await account?.getCounterFactualAddress()
    if (!ownerAddress || !account || !accountAddress) {
      return
    }

    if (!publicKeys.length) {
      throw new Error("Invalid public keys")
    }

    setIsInitializing(true)
    try {
      const threshold = Math.floor(publicKeys.length / 2) + 1
      const tree = await smt.newMemEmptyTrie()
      const lowercasedOwnerAddress = ownerAddress.toLowerCase()
      await tree.insert(0, lowercasedOwnerAddress)
      // Insert tree numerically
      await Promise.all(publicKeys.map((guard, i) => tree.insert(i + 1, guard)))
      const initializeGuardiansOp = await account.createSignedUserOp({
        target: accountAddress,
        data: PrivateRecoveryAccount__factory.createInterface().encodeFunctionData(
          "initilizeGuardians",
          [
            // BigInt is available
            publicKeys as unknown as string[],
            threshold,
            tree.root,
            updateGuardianVerifier,
            socialRecoveryVerifier,
            poseidon,
          ]
        ),
      })
      const opHash = await aaProvider.httpRpcClient.sendUserOpToBundler(
        initializeGuardiansOp
      )
      const receipt = await aaProvider.waitForTransaction(opHash)
      console.log(receipt)
    } catch (error) {
      console.log(
        "🚀 ~ file: index.tsx:50 ~ handleSetupGuardians ~ error:",
        error
      )
    }
    setIsInitializing(false)
  })

  const initializeGuardians = useEvent(async () => {
    const keyPairA = generateKeyPair()
    const keyPairB = generateKeyPair()
    const keyPairC = generateKeyPair()
    setKeyPairs(
      [keyPairA, keyPairB, keyPairC]
        .map((pairs) => pairs.privateKey.toString())
        .join("\n")
    )

    await handleSetupGuardians([
      keyPairA.publicKey[0] as bigint,
      keyPairB.publicKey[0] as bigint,
      keyPairC.publicKey[0] as bigint,
    ])
  })

  const copy = useCopyToClipboard()
  const { setToast } = useToasts()
  const copyGuardianKeys = () => {
    if (!keyPairs) {
      return
    }
    copy(keyPairs)
    setToast({ text: "Keys Copied!", type: "success" })
  }

  return (
    <AppLayout>
      <Head>
        <title>Guardian</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Page dotBackdrop width="800px" padding={0}>
        <Page.Header pt={1} pl={2}>
          <Text h2>Guardian</Text>
        </Page.Header>

        <Page.Content px={2}>
          <Grid.Container gap={2}>
            <Grid xs={6} height="50px">
              <Text h5>Account:</Text>
            </Grid>
            <Grid xs={18} justify="flex-start" height="50px">
              <Text margin={0} className="w-full break-words">
                {accountAddress}
              </Text>
            </Grid>
            {/* Show this only if no guardians, remove it after guardians has setup */}
            {!guardians?.length && (
              <Grid xs={24} justify="center">
                <Button
                  shadow
                  type="secondary-light"
                  w="100%"
                  onClick={initializeGuardians}
                  loading={isInitializing}
                >
                  Intialize Guardians
                </Button>
              </Grid>
            )}

            {!!guardians?.length && (
              <>
                <Grid xs={6} height="50px">
                  <Text h5>Your Guardians:</Text>
                </Grid>
                <Grid xs={18}>
                  <div className="flex flex-col gap-2 w-full">
                    {guardians.map((guard) => (
                      <Text
                        margin={0}
                        key={guard}
                        className="w-full break-words"
                      >
                        <span>- </span>
                        {guard}
                      </Text>
                    ))}
                  </div>
                </Grid>
              </>
            )}

            {!!keyPairs?.length && !!guardians?.length && (
              <Grid xs={24}>
                <div className="flex flex-col w-full gap-2">
                  <Description
                    title="Your Guardians Keys"
                    content="Be sure to save this keys"
                  />
                  <Textarea
                    width="100%"
                    height="5rem"
                    value={keyPairs}
                    disabled
                  />
                  <Button type="secondary" onClick={copyGuardianKeys}>
                    Copy Your Guardian Keys
                  </Button>
                </div>
              </Grid>
            )}
          </Grid.Container>
        </Page.Content>
      </Page>
    </AppLayout>
  )
}

export default Guardian
