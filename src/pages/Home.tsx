import React from 'react'
import Footer from '../Components/Footer/Footer.tsx'
import Header from '../Components/Header/Header.tsx'
import Catalog from '../Components/Catalog/Catalog.tsx'
import OurFriends from '../Components/OurFriends/OurFriends.tsx'
import Designes from '../Components/Designes/Designes.tsx'
export default function () {
  return (
    <>      
        <Header/>
        <Catalog/>
        <OurFriends/>
        <Designes/>
        <Footer/>
    </>
  )
}
