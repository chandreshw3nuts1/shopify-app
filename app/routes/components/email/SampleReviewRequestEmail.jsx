import React from 'react';

const SampleReviewRequestEmail = ({ shopRecords, emailContents, footer }) => {
    console.log(emailContents);
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
            <img src="${shopRecords.logo}" alt="Logo" class="logo">
            <div>${emailContents.body}</div>
            <img src="${emailContents.banner}" alt="banner" class="banner">
            <img src="${emailContents.getDefaultProductImage}" alt="productimage" class="productimage">
            <p>Sample Product</p>
            <a class="review-button" href="#" >${emailContents.buttonText}</a>
        </div>
    </body>`;


    return <html lang="en" dangerouslySetInnerHTML={{ __html: emailHtml }} />;

};

export default SampleReviewRequestEmail;
