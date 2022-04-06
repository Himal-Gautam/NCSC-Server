import express from 'express'
import './src/db/mongoose.js'
import userRouter from './src/routers/user.js'
import noticeRouter from './src/routers/notice.js'
import subjectRouter from './src/routers/subject.js'
import chalk from 'chalk'
import cors from 'cors'
import 'dotenv/config'

const app = express()
const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json())
app.use(userRouter)
app.use(subjectRouter)
app.use(noticeRouter)

app.listen(port, () => {
    console.log(chalk.magenta.bold.underline('Server is up on port ') + chalk.blue.bold.underline(port))
})
