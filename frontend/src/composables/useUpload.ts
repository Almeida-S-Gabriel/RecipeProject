import { BASE_URL } from "@/api";

const p= `localhost:5137/passo/`
function getUploadPath(path: string) {
  return `${BASE_URL}${path}`
}


export const useUpload = () => getUploadPath
