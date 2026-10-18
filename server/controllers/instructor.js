import User from "../models/user";
import Course from "../models/course";
//import stripe from "stripe";

const stripe = require("stripe")(process.env.STRIPE_SECRET)
export const makeInstructor= async (req,res) => {
   // Stripe Connect onboarding is not available for this platform (India), so
   // instructors join straight away and the callback page grants the role.
   // Set STRIPE_CONNECT=on to use Stripe's onboarding instead.
   try{
    if(process.env.STRIPE_CONNECT !== "on"){
        return res.json({ url: process.env.STRIPE_REDIRECT_URL });
    }
    const user = await User.findById(req.user._id).exec();
    if(!user.stripe_account_id){
        const account = await stripe.accounts.create({type: "standard"});
        user.stripe_account_id=account.id;
        await user.save();
    }
    const accountLink = await stripe.accountLinks.create({
        account:user.stripe_account_id,
        refresh_url:process.env.STRIPE_REDIRECT_URL,
        return_url:process.env.STRIPE_REDIRECT_URL,
        type:"account_onboarding",
    });
    res.json(accountLink);
}catch (err){
    console.log("MAKE INSTRUCTOR ERR",err.message);
    res.json({ url: process.env.STRIPE_REDIRECT_URL });
}
   };
export const getAccountStatus =async(req,res) => {
       try{
           const user = await User.findById(req.user._id).exec()
           const update = { $addToSet:{role:"Instructor"} };
           // Keep the Stripe account only when payouts are really enabled.
           if(user.stripe_account_id){
               try{
                   const account = await stripe.accounts.retrieve(user.stripe_account_id);
                   if(account.charges_enabled) update.stripe_seller = account;
               }catch(err){
                   console.log("STRIPE ACCOUNT STATUS ERR", err.message);
               }
           }
           const statusUpdated = await User.findByIdAndUpdate(user._id, update, {new:true})
           .select("-password")
           .exec();
           res.json(statusUpdated);

       }catch(err){
           console.log(err)
       }
   };
   export const currentInstructor = async (req,res) => {
       try{
           let user = await User.findById(req.user._id).select("-password").exec();
           if(!user.role.includes("Instructor")){
               return res.sendStatus(403);

           }else{
               res.json({ok: true});
           }

       }catch(err){
           console.log(err)
       }
   };
   export const instructorCourses  = async(req,res) => {
       try{
           const courses = await Course.find({instructor:req.user._id}).sort({createAt:-1}).exec();
           res.json(courses);
       }catch(err){
           console.log(err)
       }
   };
   export const studentCount = async(req,res)=>{
       try{
           const users = await User.find({courses:req.body.courseId}).select("_id").exec();
           res.json(users);
       }catch(err){
           console.log(err)
       }
   };

   export const instructorBalance = async (req,res) =>{
    try{
        let user= await User.findById(req.user._id).exec();
        const balance = await stripe.balance.retrieve({
            stripeAccount:user.stripe_account_id,
        });
        res.json(balance);
    }catch(err){
      console.log(err); 
    }
   };
 
   export const instructorPayoutSettings = async (req,res) =>{
    try{
        const user = await User.findById(req.user._id).exec();
        const loginLink = await stripe.accounts.createLoginLink(
            user.stripe_seller.id,{redirect_url : process.env.STRIPE_SETTING_REDIRECT}
        );
        res.json(loginLink.url);
    }catch(err){

    }
   }
