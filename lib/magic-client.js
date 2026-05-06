
import { Magic } from 'magic-sdk';

const createMagic = () => {
  console.log("process.env.NEXT_PUBLIC_MAGIC_PUBLISHABLE_API_KEY", process.env.NEXT_PUBLIC_MAGIC_PUBLISHABLE_API_KEY)
  return (
    typeof window !== "undefined" && new Magic(process.env.NEXT_PUBLIC_MAGIC_PUBLISHABLE_API_KEY)
  )
}

export const magic = createMagic();