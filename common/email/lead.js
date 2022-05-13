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
  const templatePath = `${ pathTemplates }/new-lead.ejs`;
  const memoTemplate = fs.readFileSync( templatePath, 'utf8' );

  const renderedTemplate = ejs.render( memoTemplate, emailInformation );

  const attachmentFile = get( emailInformation, 'personalIdDocument', '' );

  const mailOptions = {
    from: 'Web Trader Platform <no-reply@tradinguserplatform.com>',
    to: 'leads.providers@royalcap-int.com',
    subject: `Nuevo Lead - ${ emailInformation.firstName } ${ emailInformation.lastName }`,
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

        resolve( info )
      }
    } )

  } )
}

export default index;