import { parse } from '@fast-csv/parse';
import { Font, Template } from '@pdfme/generator';
import pkg from '@pdfme/generator';
const { generate: PDFGenerator } = pkg;
import pkg2 from '@pdfme/common';
const { getDefaultFont } = pkg2;
import { addExtension, DecoderStream, EncoderStream } from 'cbor-x';
import { createReadStream, existsSync, lstatSync, readFileSync, writeFileSync } from 'fs';
import path from 'path';
import { cwd } from 'process';

const config = {
    useRecords: false,
    mapsAsObjects: true,
    // bundleStrings: true,
    variableMapSize: true,

}

// Self-Described CBOR
class SD_CBOR {
    myData: any
    constructor(myData: any) {
        this.myData = myData
    }
}

addExtension({
    Class: SD_CBOR,
    tag: 55799, // register our own extension code (a tag code)
    encode: function (instance: any, encode: ((v: any) => Uint8Array)) {
        // define how your custom class should be encoded
        return encode(instance.myData); // return a buffer
    } as unknown as any,
    decode(data) {
        // define how your custom class should be decoded
        let instance = new SD_CBOR(data);
        // instance.myData = data
        return instance; // decoded value from buffer
    }
});

function decodeTemplate(filename: string) {
    return new Promise<{
        template: Template,
        font: Font
    }>((resolve, reject) => {
        let i = 0;
        let dec = new DecoderStream(config)
        createReadStream(filename).pipe(dec)
        dec.on('data', chunk => {
            switch (i) {
                case 0:
                    if (!(chunk instanceof SD_CBOR && chunk.myData === 'csv2pdf_tpl:v1'))
                        reject(new Error('Invalid template'))
                    break
                case 1:
                    let t: Template = chunk.template
                    let basePdf = t.basePdf as Buffer
                    resolve({
                        template: {
                            schemas: t.schemas,
                            basePdf: `data:application/pdf;base64,${basePdf.toString('base64')}`
                        },
                        font: chunk.font
                    })
                    break
            }
            i += 1 // increment
        })
    })
}

function parseCSV(filename: string) {
    return new Promise<Record<string, string>[]>((resolve, reject) => {
        const inputs: Record<string, string>[] = []
        createReadStream(filename)
            .pipe(parse({
                headers: true,
            }))
            .on('error', error => reject(error))
            .on('data', row => inputs.push(row))
            .on('end', () => {
                resolve(inputs)
            });
    })
}

const generate = async (input: string, options: { template: string, output: string }) => {
    const [data,inputs] = await Promise.all([
        decodeTemplate(options.template),
        parseCSV(input)
    ])
    let template = data.template
    let font = {
        ...data.font,
        ...getDefaultFont()
    }
    PDFGenerator({template,inputs,options:{font}}).then((pdf) => {
        writeFileSync(path.join(cwd(), options.output), pdf);
        console.log(`${inputs.length} page generated.`)
    }).catch((error) => {console.error(error.message)});
}

export default generate