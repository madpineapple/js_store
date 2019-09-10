const express = require('express');
const stripe = require('stripe')('sk_test_...');

var elements = stripe.elements();

//create token
stripe.createToken(card).then(function(result) {
  // Handle result.error or result.token

});

stripe.createToken('bank_account', {
  country: 'US',
  currency: 'usd',
  routing_number: '110000000',
  account_number: '000123456789',
  account_holder_name: 'Jenny Rosen',
  account_holder_type: 'individual',
}).then(function(result) {
  // Handle result.error or result.token
});
