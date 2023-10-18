"use client"

import { Liff } from "@liff/liff-types"
import { ReactNode, createContext, useEffect, useState } from "react"

export type LiffContextType = {
  liffObject: Liff | null
  liffError: string | null
}

export const liffContext = createContext({} as LiffContextType)

export const LiffProvider = ({ children }: { children: ReactNode }) => {
  const [liffObject, setLiffObject] = useState<Liff | null>(null)
  const [liffError, setLiffError] = useState<string | null>(null)

  // Execute liff.init() when the app is initialized
  useEffect(() => {
    // to avoid `window is not defined` error
    import("@line/liff")
      .then((liff) => liff.default)
      .then((liff) => {
        console.log("LIFF init...")
        liff
          .init({ liffId: process.env.NEXT_PUBLIC_LIFF_ID! })
          .then(() => {
            console.log("LIFF init succeeded.")
            setLiffObject(liff)
          })
          .catch((error: Error) => {
            console.log("LIFF init failed.")
            setLiffError(error.toString())
          })
      })
  }, [])

  return (
    <liffContext.Provider value={{ liffObject, liffError }}>
      {children}
    </liffContext.Provider>
  )
}
