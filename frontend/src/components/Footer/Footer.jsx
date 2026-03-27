import React from 'react'
import { FooterLogo } from './FooterLogo'
import { FooterServices } from './FooterServices'
import { FooterAddress } from './FooterAddress'
import { FooterSocial } from './FooterSocial'

export const Footer = () => {
  return (
    <footer className="bg-[#364e57] py-8">
  <section className="w-[85%] mx-auto grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-12 gap-4">
    <div className="lg:col-span-3">
      <FooterLogo />
    </div>
    <div className="lg:col-span-3">
      <FooterServices />
    </div>
    <div className="lg:col-span-3">
      <FooterAddress />
    </div>
    <div className="lg:col-span-3">
      <FooterSocial />
    </div>
  </section>

  <hr className="border-t border-gray-400 my-4" />
  <span className="text-white block text-center text-sm">
    2023 All rights reserved
  </span>
</footer>

  )
}
