"use client"

import Image from 'next/image';
import React from 'react';

const Footer = () => {
    return (

        <div className="bg-[#070909] text-white  pt-4 md:px-12 px-8">
            <div className="  py-12">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-8">

                    <div className="md:col-span-1">
                        <Image src={'/header/jora-white.svg'} width={100} height={100} alt='jora-ai-logo' />
                    </div>


                    <div>
                        <h3 className="font-light text-[#FFFFFF] mb-2">Beauty and Fashion Products.</h3>
                        <h3 className="font-light text-[#FFFFFF] mb-2">AR Virtual Hair Try on</h3>
                    </div>
                    <div>
                        <h3 className="font-semibold text-[#FFFFFF]">Contact Us</h3>
                        <div className=" text-sm text-[#FFFFFF]">
                            <p>jorra@jorra.com</p>
                            <p>0121 828 9210</p>
                        </div>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-2.5">Our Links</h3>
                        <div className=" text-sm text-[#FFFFFF]">
                            <p>About</p>
                            <p>Hair Styles</p>
                            <p>Bookmarks</p>
                            <p>Blog</p>
                            <p>Contact</p>
                        </div>
                    </div>


                    <div>
                        <h3 className="font-semibold mb-2.5">Legal</h3>
                        <div className=" text-sm text-[#FFFFFF] cursor-pointer">
                            <p>Terms of Service</p>
                            <p>Privacy Policy</p>
                        </div>
                    </div>
                </div>

                <div className="md:mt-4 mt-0  pt-2">
                    <div className=" flex flex-col space-y-34">
                        <div className="flex space-x-4 md:mb-0 mb-6 mt-4 sm:mt-0">
                            <Image src={'/footer/twitter.svg'} alt="twi-footer-svg" width={30} height={30} />
                            <Image src={'/footer/linkedin.svg'} alt="twi-footer-svg" width={30} height={30} />
                            <Image src={'/footer/instagram.svg'} alt="twi-footer-svg" width={30} height={30} />

                        </div>
                        <p className="text-sm text-[#FFFFFF] text-center">© 2023 Niyo INC. All Rights Reserved</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Footer;
