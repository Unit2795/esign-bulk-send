export class validation
{
  static getAllIndexes(arr: any[], val: any) {
    let indexes = [], i = -1;
    while ((i = arr.indexOf(val, i+1)) != -1){
      indexes.push(i);
    }
    return indexes;
  }

  static getFileExtension(filename: string)
  {
    return filename.slice((filename.lastIndexOf(".") - 1 >>> 0) + 2);
  }

  static isEmailValid(email: string)
  {
    const regex = RegExp("^(([^<>()\\[\\]\\\\.,;:\\s@\"]+(\\.[^<>()\\[\\]\\\\.,;:\\s@\"]+)*)|(\".+\"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$")
    return regex.test(email);
  }

  static formValidationRegex(charLimit: number, type: string)
  {
    let regexCharLimit = charLimit === 0 ? "*" : "{0," + charLimit +"}"

    let cannedValidators = {
      "USPhone1": "^\\([0-9]{3}\\)\\s[0-9]{3}-[0-9]{4}$",
      "USPhone2": "^[0-9]{3}-[0-9]{3}-[0-9]{4}$",
      "USPhone3": "^[0-9]{3}\\.[0-9]{3}\\.[0-9]{4}$",
      "DollarswithDecimal": "^\\$?(0|[1-9][0-9]*)(,\\d{3})*(\\.\\d{1,2})?$",
      "PoundswithDecimal": "^\\£?(0|[1-9][0-9]*)(,\\d{3})*(\\.\\d{1,2})?$",
      "EurowithDecimal": "^\\€?(0|[1-9][0-9]*)(,\\d{3})*(\\.\\d{1,2})?$",
      "CanadianSin": "^[0-9]{9}$",
      "EIN": "^\\d{2}\\-?\\d{7}$",
      "SSN": "^[0-9]{3}-?[0-9]{2}-?[0-9]{4}$",
      "Letters": "^[a-zA-Z\\s]" + regexCharLimit + "$",
      "Numbers": "^[0-9\\s]" + regexCharLimit + "$"
    };

    switch (type) {
      case "None":
        return "^[\\s\\S]{0," + charLimit +"}$"
      default:
        // @ts-ignore
        return cannedValidators[type];
    }
  }

  static fileIsBlobType(file: any, types: string[])
  {
    // @ts-ignore
    if (typeof file !== "undefined" && types.includes(validation.getFileExtension(file.name)))
    {
      return true;
    }
    return false;
  }
}