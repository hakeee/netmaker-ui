import { TextField, Button, Grid, Typography, CircularProgress } from '@material-ui/core'
import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import USER from '../Utils/User'

const styles = {
    vertTabs: {
        position: 'relative',
    },
    mainContainer: {
        marginTop: '2em',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    center: {
        textAlign: 'center'
    }
}

const useStyles = makeStyles(styles)

export default function Login({ setIsLoggingIn, setSuccess, setShouldUpdate }) {

    const [userName, setUserName] = React.useState('')
    const [error, setError] = React.useState('')
    const [isProcessing, setIsProcessing] = React.useState(false)
    const [password, setPassword] = React.useState('')

    const classes = useStyles()
    const correctUserNameRegex = new RegExp(/^(([a-zA-Z0-9,\-,\.]*)|([A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4})){3,40}$/i)
    const correctPasswordRegex = new RegExp(/^.{5,64}$/i)

    const validate = () => {
        const isUserName = correctUserNameRegex.test(userName)
        const isPassword = correctPasswordRegex.test(password)
        if (!isUserName) return {status: false, cause: 'user'}
        if (!isPassword) return {status: false, cause: 'password'}
        return {status: true}
    }

    const handleSubmit = async () => {
        const { status, cause } = validate()
        if (status) { // check if validated
            // send request
            setIsProcessing(true)
            const response = await USER.authenticate(userName, password)
            setIsProcessing(false)
            setUserName('')
            setPassword('')
            if (response) {
                setSuccess(`Successfully logged in ${userName}.`)
                setIsLoggingIn(false)
                setShouldUpdate(true)
                setTimeout(() => {
                    window.location.reload()
                }, 500)
            } else {
                setError('Failed to login, please try again.')
            }
        } else {
            if (cause === 'user')
                setError('Invalid user name provided. Must be between 3 to 40 alphanumeric characters with "-" or "." or an email address.')
            else
                setError('Invalid password provided. Must be between 5 to 64 characters with no white space.')
          
        }
    }

    const handleUpdatePassword = (event) => {
        event.preventDefault()
        setPassword(event.target.value.trim())
    }

    const handleUpdateUserName = (event) => {
        event.preventDefault()
        setUserName(event.target.value.trim())
    }

    return (
        <Grid container justify='center' className={classes.mainContainer}>
            <Grid item xs={8} >
                <div className={classes.center} >
                    {error && 
                        <Typography variant="h5" color='error'>
                            {error}
                        </Typography>
                    }
                    {
                        isProcessing && <CircularProgress />
                    }
                </div>
            </Grid>
            <Grid item xs={8}>
                <h3 style={{textAlign: 'center'}}>Login below:</h3>
                <form className={classes.form} onSubmit={e => { e.preventDefault(); handleSubmit(); }}>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="userName"
                        label="Username"
                        name="userName"
                        placeholder='username'
                        autoComplete="false"
                        autoFocus
                        value={userName}
                        onChange={handleUpdateUserName}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        placeholder=''
                        type="password"
                        onChange={handleUpdatePassword}
                        id="password"
                        value={password}
                        autoComplete="false"
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                        disabled={isProcessing}
                        style={{marginTop: '1em'}}
                    >
                        Login
                    </Button>
                </form>
            </Grid>
        </Grid>
    )
}
