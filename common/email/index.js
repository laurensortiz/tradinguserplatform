import nodemailer from 'nodemailer';
import { get, isEmpty, assignIn } from 'lodash';
import path from 'path';
import ejs from 'ejs';
import fs from 'fs';


const index = (emailInformation) => {

  const transporter = nodemailer.createTransport( {
    service: 'gmail',
    auth: {
      user: 'laurens.ortiz@gmail.com',
      pass: 'lntmgqrchimxrzdf'
    }
  } );
  const pathTemplates = path.resolve(__dirname, './templates');
  const templatePath = `${pathTemplates}/new-referral.ejs`;
  const memoTemplate = fs.readFileSync(templatePath, 'utf8');

  const renderedTemplate = ejs.render(memoTemplate, emailInformation);

  const attachmentFile = get( emailInformation, 'personalIdDocument', '' );

  const mailOptions = {
    from: 'no-reply@tradinguserplatform.com',
    to: 'laurens.ortiz@gmail.com',
    subject: `Referral Ticket de `,
    html: renderedTemplate,
  };

  if (!isEmpty( emailInformation.fileName )) {
    assignIn( mailOptions, {
      attachments: [
        {
          filename: emailInformation.fileName,
          content: attachmentFile.split( ',' )[ 1 ],
          encoding: 'base64',
        },
      ]
    } )
  }
  return new Promise( (reject, resolve) => {
    transporter.sendMail( mailOptions, function (error, info) {
      if (error) {
        console.log( '[=====  err  =====>' );
        console.log( error );
        console.log( '<=====  /err  =====]' );
        reject( error )
      } else {

        console.log( info );
        resolve( info )
      }
    } )

  } )
}

export default index;