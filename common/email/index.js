import nodemailer from 'nodemailer';
import { get, isEmpty, assignIn } from 'lodash';
import path from 'path';
import ejs from 'ejs';
import fs from 'fs';


const index = (emailInformation) => {

  const transporter = nodemailer.createTransport( {
    service: 'gmail',
    auth: {
      user: 'royal.webtrader.platform@gmail.com',
      pass: 'qtdpmbqvnvkrqqum'
    }
  } );
  const pathTemplates = path.resolve( __dirname, './templates' );
  const templatePath = `${ pathTemplates }/new-referral.ejs`;
  const memoTemplate = fs.readFileSync( templatePath, 'utf8' );

  const renderedTemplate = ejs.render( memoTemplate, emailInformation );

  const attachmentFile = get( emailInformation, 'personalIdDocument', '' );

  const mailOptions = {
    from: 'Web Trader Platform <no-reply@tradinguserplatform.com>',
    to: 'royal.capfx@gmail.com',
    bbc: 'laurens.ortiz@gmail.com',
    subject: `Referral Ticket No.${emailInformation.ticketId} de ${ emailInformation.username }`,
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
  return new Promise( (resolve, reject) => {
    transporter.sendMail( mailOptions, function (error, info) {
      if (error) {
        reject( error )
      } else {

        console.log( info );
        resolve( info )
      }
    } )

  } )
}

export default index;