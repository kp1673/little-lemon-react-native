// Named export
export function validateEmail(email) {
    return email.match(
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
  };

export function validateName(name) {
    return name.match(/^[A-Za-z]+$/);
};

export function validatePhone(phone) {
    return phone.match(
      /**
      /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/
      */
     /**
1234567890
123-456-7890
(123) 456-7890
123 456 7890
123.456.7890
+1 (123) 456-7890 */

      /^(\+0?1\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/
    );
  };