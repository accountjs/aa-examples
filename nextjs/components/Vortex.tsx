import React, { ComponentProps } from "react"
import styles from "./Vortex.module.css"

const Vortex = (props: ComponentProps<"button">) => {
  return (
    <button className={styles.wrapper} {...props}>
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
