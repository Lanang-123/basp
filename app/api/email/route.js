import SparkPost from "sparkpost";

async function emailHandler(req,res) {
    const client = new SparkPost(`90b67fa75d5f20d761173f51f4ae444687ced37f`);
    const data = JSON.parse(req.body)
    const {name,email,message} = data;
  
    client.transmission.send({
      content:{
        from: "basp.enviro@gmail.com",
        subject: "Test Email",
        html:`<html><body><p>${message}</p><p>-- ${name} </p></body></html>`
      },
      recipients:[{address:email}]
    }).then(()=>{
      res.statusCode = 200;
      res.setHeader("Content-Type","application-json");
      res.end(JSON.stringify({error:"error sending email"}))
    })
  }
  
  export default emailHandler;