// app/components/EmailTemplate.jsx
import React from 'react';

const ReviewRequestEmailTemplate = ({ emailContents, mapProductDetails, footer }) => {
    const productsHtml = mapProductDetails.map((product) => {
        const productId = product.id.split('/').pop();

        return `
        <img src=${product.images.edges[0].node.transformedSrc} alt=${product.title} class="product-image">
            <p>${product.title}</p>
            <a class="review-button" href={{review_link_${productId}}} target="_blank">${emailContents.buttonText}</a>
        `;

    }).join('');


    const emailHtml = `<head>
    <style>
    body {
        font-family: Arial, sans-serif;
        background-color: #e0c0e0;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        margin: 0;
    }

    .email-container {
        background-color: #d2a8d2;
        padding: 20px;
        text-align: center;
        border-radius: 10px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        width: 300px;
    }

    .logo {
        width: 100%;
        max-width: 250px;
        height: auto;
        margin-bottom: 20px;
    }

    .product-image {
        width: 100%;
        height: auto;
        margin: 20px 0;
        border-radius: 10px;
    }

    .review-button {
        background-color: #000;
        color: #fff;
        border: none;
        padding: 10px 20px;
        font-size: 16px;
        cursor: pointer;
        border-radius: 5px;
    }

    .review-button:hover {
        background-color: #444;
    }
    </style>
    </head>
    <body>
        <div class="email-container">
            <img src="${emailContents.logo}" alt="Logo" class="logo">
            <p>${emailContents.body}</p>
            ${productsHtml}
        </div>
    </body>`;


    return <html lang="en" dangerouslySetInnerHTML={{ __html: emailHtml }} />;

};

export default ReviewRequestEmailTemplate;
