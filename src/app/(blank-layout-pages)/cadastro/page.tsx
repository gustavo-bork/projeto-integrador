import { getServerMode } from "@/@core/utils/serverHelpers"
import Register from "@views/Register"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: 'Cadastro'
}

const CadastroPage = () => {
  const mode = getServerMode()

  return <Register mode={mode} />
}

export default CadastroPage
