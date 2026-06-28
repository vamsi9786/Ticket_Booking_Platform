const nodemailer=require('nodemailer');

const sendEmail=async(to,subject,text)=>{
    try{
        const transporter=nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth:{
                user:process.env.EMAIL_USER,
                pass:process.env.EMAIL_PASS
            }
        });

        console.log("Before");
        await transporter.verify();
        console.log("SMTP Connected");
        
        await transporter.sendMail({
            from:process.env.EMAIL_USER,
            to,
            subject,
            text,
        });
        console.log("Email sent successfully");
    } catch(err){
        console.error("Email Failed: ",err.response);
        return;
    }
};

module.exports=sendEmail;
