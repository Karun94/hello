import React, { useState, useEffect, useContext } from 'react';
import './style.css';
import { AuthContext } from "../../context/authContext";
import axios from 'axios';

function StockEntryForm() {

  const intialData = [
    { id: 1, name: 'SUGAR', quantity: 0, price: 0 },
    { id: 2, name: 'APPLE', quantity: 0, price: 0 },
    { id: 3, name: 'SALT', quantity: 0, price: 0 },
    { id: 4, name: 'WHEAT', quantity: 0, price: 0 },
    { id: 5, name: 'RAGI', quantity: 0, price: 0 },
    { id: 6, name: 'RICE', quantity: 0, price: 0 },
    { id: 7, name: 'PASTA', quantity: 0, price: 0 },
    { id: 8, name: 'GRAPES', quantity: 0, price: 0 },
    { id: 9, name: 'PERFUMES', quantity: 0, price: 0 },
    { id: 10, name: 'DAIRYMILK', quantity: 0, price: 0 },
    { id: 11, name: 'HONEY', quantity: 0, price: 0 },
    { id: 12, name: 'MANGO', quantity: 0, price: 0 },
    { id: 13, name: 'ORANGE', quantity: 0, price: 0 },
    { id: 14, name: 'ALMONDS', quantity: 0, price: 0 },
    { id: 15, name: 'KIWI', quantity: 0, price: 0 }
  ]
  const { currentUser, logout } = useContext(AuthContext);
  const id = currentUser.id
  const [captcha, setCaptcha] = useState('');
  const [userInput, setUserInput] = useState('');
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertSuccess, setAlertSuccess] = useState(false);
  const [tableData, setTableData] = useState(intialData);

  useEffect(() => {
    generateCaptcha();
    setMaxDate();
  }, []);

  const generateCaptcha = () => {
    const randomChar = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let uniqueChar = '';

    for (let i = 0; i < 5; i++) {
      uniqueChar += randomChar.charAt(Math.floor(Math.random() * randomChar.length));
    }

    setCaptcha(uniqueChar);
  }

  const setMaxDate = () => {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('datefield').setAttribute('max', today);
  }
// console.log(tableData)
  const handleInputChange = (event) => {
    setUserInput(event.target.value);
  }

  const handleQuantityChange = (event, id) => {
    const updatedTableData = tableData.map((item) => {
      if (item.id === id) {
        return { ...item, quantity: event.target.value };
      }
      return item;
    });

    setTableData(updatedTableData);
  }

  const handlePriceChange = (event, id) => {
    const updatedTableData = tableData.map((item) => {
      if (item.id === id) {
        return { ...item, price: event.target.value };
      }
      return item;
    });

    setTableData(updatedTableData);
  }

  const handleNewCaptcha = () => {
    generateCaptcha();
  }


  const handleSubmit = async (event) => {
    // event.preventDefault();

    if (userInput === captcha) {
      setAlertVisible(true);
      setAlertSuccess(true);
    console.log(tableData)
      try {
        for (const item of tableData) {
          // Prepare the data for the current item
          const formData = {
            s_no: item.id,
            name: item.name, // Assuming 'product' is the same as 'name' based on your table structure
            quantity: item.quantity,
            price: item.price,
            entered_date: event.target.date.value,
            enteredBy_id: id,
          };

          // Send the data to the backend for this item asynchronously
          const response = await axios.post('http://localhost:8800/api/products/postProduct', formData, {
            withCredentials: true,
          });

          console.log(`Data for product ${item.name} submitted successfully:`, response.data);
          // You can handle success here, e.g., show a success message or redirect

          // Delay before sending the next item (adjust the delay as needed)
          // await new Promise((resolve) => setTimeout(resolve, 1000)); // 1-second delay
        }
        setTableData(intialData)
      } catch (error) {
        console.error('Error submitting data:', error);
        // Handle error, e.g., show an error message to the user
      }
    } else {
      setAlertVisible(true);
      setAlertSuccess(false);
      // Handle invalid CAPTCHA input here
    }
  };



  

  return (
    <div>
      <form onSubmit={handleSubmit}>
        {/* Your navigation and date input */}
        {/* ... */}
       
        <label htmlFor="date" style={{ marginLeft: '40%', fontSize: 'medium' }}>Date :</label>
        <input type="date" id="datefield" name="date" required />

        <center>
          <table style={{ width: '70%' }} cellPadding="10" className="table table-bordered">
            <thead>
              <tr className="bg-secondary text-white">
                <th>Product ID</th>
                <th>Name</th>
                <th>Quantity</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.name}</td>
                  <td>
                    <input
                      type="text"
                      name={`Q${item.id}`}
                      value={item.quantity}
                      onChange={(e) => handleQuantityChange(e, item.id)}
                    />
                  </td>
                  <td>
                    &#8377;<input
                      type="number"
                      name={`P${item.id}`}
                      value={item.price}
                      onChange={(e) => handlePriceChange(e, item.id)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div id="user-input" className="inline mt-5">
            <input
              type="text"
              id="submit"
              placeholder="Captcha code"
              onChange={handleInputChange}
              value={userInput}
            />
          </div>
          <div className="inline" onClick={generateCaptcha} >
            <i className="fas fa-sync"></i>
          </div>
          
          <div id="image" className="inline" selectable="False" >
            {captcha}
          </div>
          <div className="inline">
            <button id="refresh-captcha" onClick={handleNewCaptcha}>Refresh Captcha</button>
          </div>
          <input type="submit" id="btn" required />
         
          <span><button id="btn" type="reset" style={{ border: 'none' }}>Reset</button></span>
          <p id="key"></p>
          {alertVisible && (
            <div className={`alert ${alertSuccess ? 'success' : ''}`}>
              {alertSuccess ? 'Form submitted successfully!' : 'Invalid Captcha! Please try again.'}
            </div>
          )}
        </center>
      </form>
    </div>
  );
}

export default StockEntryForm;
