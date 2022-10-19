import moment from "moment"
import "moment/locale/id"
moment.locale("id")

export const rupiahFormat = (num) => {
  return parseInt(num).toLocaleString("id-ID", { style: "currency", currency: "IDR" })
}

export const dateTimeFormat = (date) => {
  return moment(date).format("Do MMMM YYYY HH:mm:ss")
}

export const dateFormat = (date) => {
  return moment(date).format("Do MMMM YYYY")
}

export const checkNumber = (str) => {
  return /^\d+$/.test(str)
}