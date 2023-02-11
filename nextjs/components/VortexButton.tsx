import { ComponentProps, useEffect, useState } from "react"
import Vortex from "./Vortex"

type VortexButtonProps = ComponentProps<"button"> & {
  rotate: boolean
}

const VortexButton = ({ rotate, onClick }: VortexButtonProps) => {
  return !rotate ? (
    <button
      onClick={onClick}
      className="capitalize inline-flex items-center rounded-full border border-transparent bg-red-500 px-3 py-2 text-sm font-medium leading-4 text-white shadow-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
    >
      &nbsp;
    </button>
  ) : (
    <Vortex onClick={onClick} />
  )
}

export default VortexButton
