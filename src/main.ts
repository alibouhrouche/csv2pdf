#!/usr/bin/env node
import { Command } from 'commander';
import {name, description, version} from '../package.json'
import generate from './generate.js';
const program = new Command();

program
	.name(name)
	.description(description)
	.version(version)

program
	.command('generate')
	.description('Generate a PDF file from a specified CSV file.')
	.argument('<input-file>','The CSV file to generate from')
	.option('-t, --template <template-file>','The PDF Template')
	.option('-o, --output <output-file>','The PDF Output')
	.action(generate)

// program
// 	.command('apply')
// 	.description('Apply the specified fields to the template')
// 	.argument('<input-file>','The original template file')
// 	.argument('<fields>','Comma separated list of fields')
// 	.argument('<values>','Comma separated list of values')
// 	.option('-o, --output <output-file>','The output file for the resulting template')
// 	.action(apply)

program.parse()