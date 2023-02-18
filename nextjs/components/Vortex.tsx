import React, { ComponentProps } from "react"
import styles from "./Vortex.module.css"
import cx from "clsx"

const Vortex = (props: ComponentProps<"button">) => {
  return (
    <button {...props} className={cx(styles.wrapper, props.className)}>
      <div className={styles.arc}>
        <div className={styles.arc}>
          <div className={styles.arc}>
            <div className={styles.arc}>
              <div className={styles.arc}>
                <div className={styles.arc}>
                  <div className={styles.arc}>
                    <div className={styles.arc}>
                      <div className={styles.arc}>
                        <div className={styles.arc}>
                          {/* <div className={styles.arc}>
                            <div className={styles.arc}>
                              <div className={styles.arc}>
                                <div className={styles.arc}>
                                  <div className={styles.arc}>
                                    <div className={styles.arc}></div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div> */}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </button>
  )
}

export default Vortex
