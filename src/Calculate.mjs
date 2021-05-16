//calculation helper functions

export function dollarInputValid(amount)
{ //returns bool based on if the dollar input amount is valid
  if(amount >= 0)
    { 
      const amountStrArr = amount.toString().split(".");
      if( amountStrArr.length > 1 && amountStrArr[1].length > 2)
      {
        console.log("dollar amount must be to 2 decimal places.");
        return false;
      }
      else { return true; }
    }
    else { 
      console.log("price must be positive");
      return false;
    }
}

function toCents(dollars)
{
  //console.log("parseFloat(dollars) " + parseFloat(dollars));
  //console.log("parseFloat(dollars) * 100)" + parseFloat(dollars) * 100);
  //console.log("Math.floor(parseFloat(dollars) * 100)" + Math.floor(parseFloat(dollars) * 100));
  const dollarArr = dollars.toString().split(".");
  var dollarCents = 0;
  var cents = 0;
  if(dollarArr.length > 1)
  {
    if(dollarArr[0] === "")
    { dollarCents = 0;}
    else { dollarCents = parseInt(dollarArr[0]) * 100; }

    if(dollarArr[1] === "")
    { cents = 0;}
    else { cents = parseInt(dollarArr[1]); }
    //console.log("dollars: " + dollars);
    //console.log("dollarCents: " + dollarCents);
    //console.log("cents: " + cents);
    return dollarCents + cents;
  }
  return Math.floor(parseFloat(dollars) * 100);
}

function adjustTierFee(fees)
{ //formats the fee input for printing to the console
  if(fees === "")
      { return "None"; }
  else { return "$" + parseFloat(fees).toFixed(2).toString() ; }
}

export function computeFees(values, p)
{ //returns string containing the fee amount or error message
  //called by handleCalculateFees
  if(p === "")
  {
    return "No price is provided. Please provide a price.";
  }
  const price = toCents(p);
  if(values.length === 1)
  {
    const tier = values[0];
    if(price >= toCents(tier.lowerBound))
    {  return "FEE: " + adjustTierFee(tier.fees); }
  }
  if(price < toCents(values[0].lowerBound))
  {
      return "Price provided is below the lowest price bound. Please provide a value above the lowest price bound.";
  }
  
  for(let i = 0; i < values.length-1; i++)
  {
    const tier = values[i];
    if(price >= toCents(tier.lowerBound) && price <= toCents(tier.upperBound))
    {
      return "FEE: " + adjustTierFee(tier.fees);
    }
  }
  const topTier = values[values.length - 1];
  return "FEE: " + adjustTierFee(topTier.fees);
}

export function areTiersValid(values)
{//checks if user inputted tier combination is valid
  //returns a message for printing to the console, and a boolean value
  if(values.length === 1)
  {
    const tier = values[0];
    if(tier.lowerBound === "")
    { return {message: "Tier is not valid. Please provide a Lower Bound value", valid: false}; }
  }
  for(let i = 0; i < values.length-1; i++)
  {
    const tier = values[i];
    const nextTier = values[i+1];
    if(tier.lowerBound === ""  || tier.upperBound === "" || nextTier.lowerBound === "" )
    {
        return {message: "Tiers are not valid. Please make sure all tiers have values provided", valid: false};
    }
    else if(toCents(tier.upperBound) !==  toCents(nextTier.lowerBound)- 1) 
    {
      //console.log( "lower tier upper bound: " + toCents(tier.upperBound));
      //console.log( "upper tier lower bound: " + toCents(nextTier.lowerBound));
      //console.log("upper tier lower bound minus one  " + (toCents(nextTier.lowerBound)- 1));

      const m = "Tiers are not valid. Tier " + i + " has upper bound " + tier.upperBound +
      " while Tier " + (i+1) + " has lower bound " + nextTier.lowerBound + 
      ". They must have a difference of .01 to be valid.";
        return {message: m, valid: false};
    }  
    else if(toCents(tier.lowerBound) > toCents(tier.upperBound))
    {
      const m = "Tiers are not valid. Tier " + i + " has lower bound " + tier.lowerBound +
      " and upper bound " + tier.upperBound;
        return {message: m, valid: false};
    }
  }
    return { message: "Tiers are valid.", valid: true};
}