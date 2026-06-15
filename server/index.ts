import express from 'express'
import cors from 'cors'
import steamRoutes from './routes/steam'

const app = express()
const PORT = 3001

app.use(cors())
app.use(express.json())
app.use('/api', steamRoutes)

app.listen(PORT, () => {
  console.log(`Steam proxy server running on http://localhost:${PORT}`)
})
