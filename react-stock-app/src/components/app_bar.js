import { Typography, colors } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import { useContext, useState } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import StockContext from '../context/stock_context';

export default function App_Bar() {
    const context = useContext(StockContext);

    const sharesList = ["AAPL", "GOOG", "MSFT", "CSCO", "META", "AMZN", "EBAY", "TSLA", "ADBE", "NFLX", "SBUX", "AMD", "NVDA", "QCOM", "INTC", "EA", "ATVI", "TTWO", "PYPL", "COKE", "TXN", "XPEV", "F", "ABNB", "AEP", "TEAM", "HON", "WBD"]

    const handleInput = (event, value) => {
        if (event._reactName == "onClick" || event._reactName == "onKeyDown") {
            const match = sharesList.filter(item => item == value.toUpperCase())
            console.log("match is : ", match);
            if (match.length == 1)
                context.setStockSymbol(match[0]);
        }
    };

    return (<AppBar position="sticky">
        <Toolbar>
            <Typography
                fontSize={30}
                variant="h6"
                noWrap
                component="div"
                sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
            >
                Stock It!
            </Typography>
            <Autocomplete
                freeSolo
                id="free-solo-2-demo"
                disableClearable
                options={sharesList}
                renderInput={(params) => <TextField
                    sx={{ width: 350, margin: "10px auto", '& fieldset': { border: 'none' }, '& label.Mui-focused': { display: 'none' }, background: "#0c97e8", borderRadius: '4px' }}
                    {...params}
                    label="Search"
                    InputLabelProps={{ style: { color: 'white', fontSize: 16 }, shrink: false }}
                    InputProps={{ ...params.InputProps, type: 'search', style: { color: 'white', fontSize: 16, paddingBottom: 2, paddingTop: 2 } }} />}
                //onSelect={handleInput}
                onInputChange={handleInput}
            />
        </Toolbar>
    </AppBar>);
}