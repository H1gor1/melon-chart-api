# Melon Music Chart API

This API provides an interface to access Melon Music Chart data, allowing you to retrieve real-time, daily, weekly, and monthly information.

This is a modified version of the repository: [melon-chart-api](https://github.com/hyunchel/melon-chart-api)

All credits to the creator: [hyunchel](https://github.com/hyunchel)

## How to Use

### Installation

1. Clone the repository to your local environment:

   ```
   git clone https://github.com/H1gor1/melon-chart-api.git
   ```

2. Navigate to the project directory:

   ```
   cd melon-chart-api
   ```

3. Install dependencies:

   ```
   npm install
   ```
### Local Execution

   ```
    npm start
   ```
The API will be accessible at http://localhost:3000.

### API Routes:
  #### Get Real-Time Chart:
    GET /api/melon/realtime
  #### Get Daily Chart:
    GET /api/melon/daily
  #### Get Weekly Chart:
    GET /api/melon/weekly
  #### Get Montly Chart:
    GET /api/melon/monthly
  
| Parâmetro   | Tipo       | Descrição                                   |
| :---------- | :--------- | :------------------------------------------ |
| `rank`      | `String` | Current song rank |
| `title`      | `String` | Song name |
| `artist`      | `String` | Artist name |
| `album`      | `String` | Album name |
| `imageUrl`      | `String` | Album/song image URL |

## Licença

[MIT](https://choosealicense.com/licenses/mit/)
