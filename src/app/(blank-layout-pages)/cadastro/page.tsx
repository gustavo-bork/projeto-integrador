import { getServerMode } from "@/@core/utils/serverHelpers"
import Register from "@views/Register"

const CadastroPage = () => {
  const mode = getServerMode()

  return <Register mode={mode} />
}

export default CadastroPage
