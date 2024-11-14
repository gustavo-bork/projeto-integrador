import type { Metadata } from "next"

import Map from "@components/Map"

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
