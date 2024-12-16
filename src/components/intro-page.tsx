"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

export default function IntroPage() {
  return (
    <div className="relative min-h-screen">
      {/* Background Image with Dark Overlay */}
      <div className="absolute inset-0 bg-cover bg-center bg-no-repeat brightness-75 contrast-90"
           style={{
             backgroundImage: "url('/images/background.png')",
             filter: "brightness(55%) contrast(97%) opacity(30%)"
           }}
      >
      </div>

      {/* Content Section */}
      <div className="relative flex flex-col min-h-screen">
        {/* Top Bar */}
        <div className="flex justify-between items-center px-8 py-4 border-b border-gray-800 z-10">
          {/* Logo */}
          <div className="text-2xl font-uniSansBold font-bold tracking-wide">Out of Loop</div>
          {/* Sign In */}
          <Link
            href="/landing-page"
            className="flex items-center px-4 py-2 font-bold bg-white text-gray-900 rounded-full hover:bg-gray-200 transition"
            >
            Sign In
            <Image
                src="/images/button-arrow.png"
                alt="Arrow"
                width={15} // Adjust size as needed
                height={15}
                style={{
                    transform: "rotate(90deg)",
                    filter: "opacity(100%)",
                  }}
                className="ml-2"
            />
            </Link>
        </div>

        {/* Hero Section */}
        <div className="flex flex-col items-center justify-center flex-1 text-center lg:ml-48 md:ml-24 sm:ml-8 px-4 sm:px-8 md:px-0">
            {/* Heading */}
            <h1 className="text-4xl mt-8 sm:text-5xl md:text-6xl lg:text-7xl font-uniSansBold font-extrabold leading-tight uppercase tracking-wide lg:-ml-16 md:-ml-10 sm:ml-0 z-50 lg:mt-16 lg:z-0">
                Never Argue with Prompts Again <br />
                <span
                style={{
                    WebkitTextStroke: "2px white", // Outline stroke color and width
                    WebkitTextFillColor: "transparent", // Makes the text itself transparent
                }}
                >
                don’t waste time
                </span>
            </h1>

            {/* Subheading */}
            <p className="text-base sm:text-lg md:text-xl lg:text-xl lg:ml-20 md:ml-16 sm:ml-8 mt-4 sm:mt-6 md:mt-8 lg:mt-8 font-uniSansThin max-w-xs sm:max-w-md md:max-w-lg lg:max-w-2xl text-white/80 z-50">
                Your time is valued. Out of Loop chat eliminates the need for perfect prompts, turning your ideas into results effortlessly and instantly.
            </p>
            
          {/* CTA Buttons */}
          <div className="mt-8 flex space-x-4 z-10">
            <Link href="/learn-more">
              <button className="px-6 py-3 font-uniSansThin bg-transparent border-2 border-white text-white rounded-full hover:bg-white hover:text-gray-600 transition">
                Learn More
              </button>
            </Link>
            <Link href="/landing-page">
            <button className="flex items-center px-6 py-3 font-uniSansBold border-2 bg-white border-white text-gray-900 font-bold rounded-full hover:bg-gray-200 transition z-10">
                Start Now
                <Image
                src="/images/button-arrow.png"
                alt="Arrow"
                width={15} // Adjust size as needed
                height={15}
                style={{
                    transform: "rotate(90deg)",
                    filter: "opacity(100%)",
                  }}
                className="ml-2"
                />
            </button>
            </Link>
          </div>
        </div>

        {/* Bottom Section (Hands Image) */}
        <div className="absolute top-64 pt-36 bottom-0 -left-64 flex justify-center items-center overflow-hidden lg:top-16 lg: lg:pt:20 lg:-left-24 ">
          <Image
            src="/images/hands.png"
            alt="Hands Image"
            width={800}
            height={400}
            style={{
              transform: "rotate(30deg)",
              filter: "grayscale(100%) brightness(65%) contrast(140%)",
            }}
            className="object-contain"
          />
        </div>

        {/* Vertical Text */}
        <div className=" text-gray-400 absolute font-uniSans -left-16 top-40 -translate-y-1/2 -rotate-90 text-xs uppercase font-semibold tracking-wider z-10 lg:top-96">
            Best Platform № One
        </div>
        <div className="text-gray-400 absolute -right-32 bottom-36 -rotate-90 text-xs uppercase font-semibold tracking-wider z-10">
            Powerful Minor Artificial Intelligence
        </div>
      </div>
    </div>
  );
}
