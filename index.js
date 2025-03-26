import 'dotenv/config'
import { app } from './src/app.js'

const PORT = process.env.PORT || 3010

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
