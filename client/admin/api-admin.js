const listVerifySeller = async (credentials, signal) => {
  try {
    let response = await fetch("/api/list_verify_seller", {
      method: "GET",
      signal: signal,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + credentials.t
      }
    })
    return await response.json()
  } catch (err) {
    console.log(err)
  }
}

const getSeller = async (params, credentials, signal) => {
  try {
    let response = await fetch('/api/detail_seller/' + params.userId, {
      method: 'GET',
      signal: signal,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + credentials.t
      }
    })
    return await response.json()
  } catch(err) {
    console.log(err)
  }
}

const acceptSeller = async (params, credentials) => {
  try {
    let response = await fetch('/api/accept_seller/' + params.userId, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + credentials.t
      },
    })
    return await response.json()
  } catch(err) {
    console.log(err)
  }
}

const declineSeller = async (params, credentials) => {
  try {
    let response = await fetch('/api/decline_seller/' + params.userId, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + credentials.t
      },
    })
    return await response.json()
  } catch(err) {
    console.log(err)
  }
}

export { 
    listVerifySeller,
    getSeller,
    acceptSeller,
    declineSeller
}
