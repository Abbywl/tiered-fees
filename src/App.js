import React, {useState} from 'react';
import Container from '@material-ui/core/Container';
import { TextField } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import RemoveIcon from '@material-ui/icons/Remove';
import AddIcon from '@material-ui/icons/Add';
import Icon from '@material-ui/core/Icon';
import { Typography } from '@material-ui/core';
import{ makeStyles } from '@material-ui/core/styles';
import { computeFees } from './Calculate.mjs';
import { areTiersValid } from './Calculate.mjs';
import { dollarInputValid } from './Calculate.mjs';

document.body.style = 'background: #DDD1FF;';
//Just Material UI formatting
const useStyles = makeStyles((theme) => ({
    root: {
      '& .MuiTextField-root': {
      margin: theme.spacing(2),
      },
    },
    button: {
      margin: theme.spacing(2),
    }
}))

//Actual App function starts here
function App() {

  const classes = useStyles()
  const [inputFields, setInputFields] = useState(
    [
      {lowerBound: '', upperBound: 'INF', fees: '0.00'},
    ]);
  const [price, setPrice] = useState('0.00');

  const handleSubmitTiers = (event) => {
        event.preventDefault();
        console.log(areTiersValid([...inputFields]).message);
  };

  //handles change of single input box
  const handleChangeInput = (index, event) => {
    const values = [...inputFields];
    if(dollarInputValid(event.target.value))
    {
          values[index][event.target.name] = event.target.value;
          setInputFields(values);
    }
  }

  const handleAddTiers = () => {
    if(inputFields.length === 1) //what if length === 0?
    {
      const ogVals = [...inputFields];
      const changedVal = [{lowerBound: ogVals[0].lowerBound, upperBound: '', fees: ogVals[0].fees}];
      //changed the upperBound of the single tier to empty string instead of INF
      const newVals = changedVal.concat([{lowerBound: '', upperBound: "INF", fees: '0.00'}]);
      setInputFields(newVals);
    }
    else{
    const values = inputFields.slice(0,[...inputFields].length -1);//array without last element
    const lastVal = inputFields[inputFields.length-1];//last value
    const newVals = values.concat([{lowerBound: lastVal.lowerBound, upperBound: '', fees: lastVal.fees}]);

    setInputFields(newVals.concat([{lowerBound: '', upperBound: "INF", fees: '0.00'}]));
    }
  }

  const handleRemoveTiers = () => {
    if(inputFields.length > 2)
    {
      const values = inputFields.slice(0,[...inputFields].length -2);//array without last 2 element
      const lastVal = inputFields[inputFields.length-2];//2nd to last element
      const newVal = [{lowerBound: lastVal.lowerBound, upperBound: "INF", fees: lastVal.fees}];
      //newVal is new last element with INF upperBound
      setInputFields(values.concat(newVal));
    }
    else if(inputFields.length === 2)
    {
      const values = [...inputFields][0];
      setInputFields([{lowerBound: values.lowerBound, upperBound: "INF", fees: values.fees}]);
    }
  }

  const handleSetPrice = (event) => {
    if(dollarInputValid(event.target.value))
     { setPrice(event.target.value); }
  }

  const handleComputeFees = (event) => {
    const tierStatus = areTiersValid([...inputFields]);
    if(tierStatus.valid)
    {
      console.log(computeFees( [...inputFields], price));
    }
  }
  

  return (
    <Container>
      <Typography variant="h4" component="h1" color="primary">
          Tiered Fees
      </Typography>
      <Typography variant="subtitle2" component="h2" color="primary" align= 'justify'>
          Please enter values in dollar amounts. e.g. 1.00 for a dollar
      </Typography>

      <header className="App-header">
        <form className = {classes.root} onSubmit={handleSubmitTiers} >
          { inputFields.slice(0,[...inputFields].length -1).map((inputField, index) => (
            <div key={index}>
              {/*<input type="number" step = "0.01" min="0" />*/}

              <TextField
                name="lowerBound"
                label="Lower Bound"
                InputLabelProps={{
                  shrink: true
                }}
                variant="outlined"
                type="number"
                value={inputField.lowerBound}
                onChange={event => handleChangeInput(index, event) }
                />
              <TextField
                name="upperBound"
                label="Upper Bound"
                InputLabelProps={{
                  shrink: true
                }}
                variant="outlined"
                type="number"
                value={inputField.upperBound}
                onChange={event => handleChangeInput(index, event) }     
                />
                <TextField
                name="fees"
                label="Fees"
                InputLabelProps={{
                  shrink: true
                }}
                variant="outlined"
                type="number"
                value={inputField.fees}
                onChange={event => handleChangeInput(index, event) }
                />

            </div>
          ))
          }
             
             { inputFields.slice([...inputFields].length -1).map((inputField, index) => (
            <div key={[...inputFields].length-1 }>
              {/*<input type="number" step = "0.01" min="0" />*/}

              <TextField
                name="lowerBound"
                label="Lower Bound"
                InputLabelProps={{
                  shrink: true
                }}
                variant="outlined"
                type="number"
                value={inputField.lowerBound}
                onChange={event => handleChangeInput([...inputFields].length-1, event) }
                />
              <TextField
                disabled
                name="upperBound"
                label="Upper Bound"
                InputLabelProps={{
                  shrink: true
                }}
                variant="outlined"
                value={inputField.upperBound}
                onChange={event => handleChangeInput([...inputFields].length-1, event) }     
                />
                <TextField
                name="fees"
                label="Fees"
                InputLabelProps={{shrink: true}}
                variant="outlined"
                type="number"
                value={inputField.fees}
                onChange={event => handleChangeInput([...inputFields].length-1, event) }
                />

            </div>
          ))
          }
           
          <Button 
          className= {classes.button}
          variant= "contained"
          color = "primary"
          type = "submit" 
          endIcon={<Icon>autorenew</Icon>}
          onClick={handleSubmitTiers}>
          Submit Tiers
        </Button>
          <IconButton
            onClick = { () => handleRemoveTiers() }
          >
                <RemoveIcon/>
          </IconButton>
          <IconButton
            onClick = { () => handleAddTiers() }
            >
                <AddIcon/>
          </IconButton>
          <p></p>
          <TextField
                name="price"
                label="Price"
                InputLabelProps={{
                  shrink: true
                }}
                variant="outlined"
                type="number"
                value={price}
                onChange={event => handleSetPrice(event) }
          />

          <Button 
          className= {classes.button}
          variant= "contained"
          color = "primary"
          type = "submit" 
          onClick={handleComputeFees}>
          Compute Fees
        </Button>

        </form>
      </header>
      
    </Container>
  );
}

export default App;
