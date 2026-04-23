import Config from "@/config"

export const imageUrl = (filename: string) => `${Config.API_URL}/images/${filename}`
