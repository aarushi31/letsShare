const nodemailer=require('nodemailer');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.API_KEY)
async function sendMail({to,from,subject,text,html}){
    // let transporter=nodemailer.createTransport({
    //     host:process.env.SMTP_HOST,
    //     port:process.env.SMTP_PORT,
    //     secure:false,
    //     auth:{
    //         username:process.env.USER,
    //         password:process.env.PASS
    //     }
    // });

    // let info=await transporter.sendMail({from:`LetsShare <${from}>`,to,subject,text,html})

    try {
        await sgMail.send({to,from,subject,text,html});
        console.log('Test email sent successfully');
      } catch (error) {
        console.error('Error sending test email');
        console.error(error);
        if (error.response) {
          console.error(error.response.body)
        }
      }
    }




module.exports=sendMail