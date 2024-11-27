import History from "@components/History"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: 'Histórico de pesquisa'
}

const HistoryPage = () => {
  return (
    <History />
  )
}

export default HistoryPage
