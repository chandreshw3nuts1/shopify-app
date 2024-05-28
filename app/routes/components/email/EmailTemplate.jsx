// app/components/EmailTemplate.jsx
import React from 'react';

const EmailTemplate = ({ recipientName, content, footer }) => {
    const emailHtml = `<!DOCTYPE html>
    <html lang="en">
    <head>
        <style>
            body {
                font-family: Arial, sans-serif;
                margin: 0;
                padding: 0;
                background-color: #eaa6ea;
                
            }
            .container {
                max-width: 500px;
                margin: 0 auto;
                padding: 20px;
                background-color: #c2a0a0;
                border-radius: 5px;
                box-shadow: 1px 1px 10px rgba(0, 0, 0, 0.1);
            }
            .container-logo {
                max-width: 500px;
                margin: 0 auto;
                padding: 20px;
            }
            .header, .footer {
                text-align: center;
                padding: 10px 0;
            }
            .content {
                padding: 20px 0;
            }
            .btn-start {
                display: inline-block;
                padding: 10px 20px;
                margin-top: 20px;
                font-size: 16px;
                color: #fff !important;
                background-color: #007bff;
                text-decoration: none;
                border-radius: 5px;
            }
            .btn-start:hover {
                background-color: #0056b3;
            }
            .footer {
                font-size: 12px;
                color: #6c757d;
            }
        </style>
    </head>
    <body style=" background-color:#edf2f7;  height: 100%;  width: 100%!important">
        <div class="container-logo">
            <div class="header">
                <h1>Logo</h1>
            </div>
            
        </div>

        <div class="container">
            <div class="header">
                <h1>Welcome to Our Service</h1>
            </div>
            <div class="content">
                <p>Hello, <strong>${recipientName}</strong>!</p>
                <p>We're excited to have you on board. Click the button below to get started:</p>
                <a href="${recipientName}" class="btn-start">Get Started</a>
                <p>If you have any questions, feel free to reply to this email. We're here to help!</p>
            </div>
            <div class="footer">
                <p>Best regards,</p>
                <p>Your Company Name</p>
                <p><a href="https://example.com">www.example.com</a></p>
            </div>
        </div>
    </body>
    </html>`;

    return <div dangerouslySetInnerHTML={{ __html: emailHtml }} />;

};

export default EmailTemplate;
