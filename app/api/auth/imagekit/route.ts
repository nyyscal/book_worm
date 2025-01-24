import config from "@/lib/config/config"
import ImageKit from "imagekit"
import { NextResponse } from "next/server";

const {
  env:{
    imagekit:{publicKey,privateKey,urlEndpoint},
  },
}= config;

const imagekit = new ImageKit({
  publicKey,
  privateKey,
  urlEndpoint,
})

export async function GET(request: Request){
  // Add CORS headers
  const headers = {
    'Access-Control-Allow-Origin': process.env.NEXT_PUBLIC_API_ENDPOINT || '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  }

  return NextResponse.json(
    imagekit.getAuthenticationParameters(),
    { headers }
  )
}