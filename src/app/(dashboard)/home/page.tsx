import Map from "@components/Map"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: 'Início'
}

const HomePage = () => {
  return (
    <div>
      <Map />
    </div>
  )
}

export default HomePage
