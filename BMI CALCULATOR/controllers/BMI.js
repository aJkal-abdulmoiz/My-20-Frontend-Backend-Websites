

async function calculateBMI(req,res){

    let {height,weight} = req.body;
    console.log(weight,height)

    if(!height||!weight) return res.status(400).json({error:'Weight and Height is Required'})

    height = height / 100;

    let BMI = weight / (height * height);

    BMI = BMI.toFixed(2);

    
    return res.json({ bmiNum: BMI, redirectTo: '/' });

}

module.exports ={
    calculateBMI,
}