import * as vscode from 'vscode';
import * as assert from 'assert';
import { sleep } from '../helper';
import * as _ from 'lodash';

export async function testDiagnostics(docUri: vscode.Uri, expectedDiagnostics: vscode.Diagnostic[]) {
  // For diagnostics to show up
  await sleep(2000);

  const result = vscode.languages.getDiagnostics(docUri);

  expectedDiagnostics.forEach(ed => {
    assert.ok(
      result.some(d => {
        return isEqualDiagnostic(d, ed);
      }),
      `Cannot find matching diagnostics for ${ed.message}\n${JSON.stringify(ed)}\n`
    );
  });

  function isEqualDiagnostic(d1: vscode.Diagnostic, d2: vscode.Diagnostic) {
    const sourcesAreEqual = d1.source ? d1.source === d2.source : true;

    const tagsAreEqual = d1.tags ? _.isEqual(d1.tags, d2.tags) : true;

    return (
      d1.severity === d2.severity &&
      // Only check beginning equality as TS's long messages are ever-changing
      d1.message.slice(0, 40) === d2.message.slice(0, 40) &&
      d1.range.isEqual(d2.range) &&
      tagsAreEqual &&
      sourcesAreEqual
    );
  }
}
