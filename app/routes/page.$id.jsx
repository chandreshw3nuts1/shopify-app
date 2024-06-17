import { useEffect, useState, useRef } from "react";
import { useLoaderData } from "@remix-run/react";

//   export const loader  = async ({ request }) => {
//     const pageDescription = "fa fa fa fa";
//     return { pageDescription };
//   };


export const meta = () => {
    return [
        { property: "og:ursite_namel" , context:"my site"},
        { property: "og:url" , context:"trycloudflare.com"},
        { property: "og:title" , context:"fafa title"},
        { property: "og:type", content : "website" },
        { property: "og:image", content : "http://chandstest.myshopify.com/cdn/shop/files/shitr.jpg?v=1714996209" },
        { property: "og:description", content : "my desccc" },
        { property: "og:image:secure_url", content : "https://chandstest.myshopify.com/cdn/shop/files/shitr.jpg?v=1714996209" },
    ];
  };

//   export const meta = ({ data }) => {
    
//     return [
//         { property: "og:title" , context:"fafa title"},
//         { property: "og:type", content : "website" },
//         { property: "og:image", content : "http://chandstest.myshopify.com/cdn/shop/files/shitr.jpg?v=1714996209" },
//         { property: "og:description", content : "my desccc" },
//         { property: "og:image:secure_url", content : "https://chandstest.myshopify.com/cdn/shop/files/shitr.jpg?v=1714996209" },
//         { image: "https://www.word-meaning.com/word_images/brevity.png" },
//       ];

//   };
  
export default function page() {
	
    const shareToFacebook = () => {
        const encodedUrl = 'https://cited-guidelines-connecticut-treasurer.trycloudflare.com';
		const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        window.open(shareUrl, '_blank', 'width=600,height=400');
	}
		
  return (
	<>
            <a href="#" onClick={(e) => shareToFacebook()} >share</a>

    </>
  );
}
