// ClypCompiler — SCORM 1.2 packaging metadata.
// The exported index.html is a single SCO. It runs identically without an
// LMS: the runtime's SCORM adapter simply finds no API and falls back to
// localStorage, which is what makes the package double as a plain HTML5 site.
import type { Course } from '../model/course'

function xmlEsc(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

/** Builds imsmanifest.xml for a single-SCO SCORM 1.2 package. */
export function buildScormManifest(course: Course, assetPaths: string[]): string {
  const id = `CLYP-${course.uuid}`
  const title = xmlEsc(course.meta.title || 'Untitled Course')
  const fileTags = ['index.html', ...assetPaths]
    .map((p) => `        <file href="${xmlEsc(p)}"/>`)
    .join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>
<manifest identifier="${xmlEsc(id)}" version="${xmlEsc(course.meta.version || '1.0')}"
  xmlns="http://www.imsproject.org/xsd/imscp_rootv1p1p2"
  xmlns:adlcp="http://www.adlnet.org/xsd/adlcp_rootv1p2"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://www.imsproject.org/xsd/imscp_rootv1p1p2 imscp_rootv1p1p2.xsd
                      http://www.imsglobal.org/xsd/imsmd_rootv1p2p1 imsmd_rootv1p2p1.xsd
                      http://www.adlnet.org/xsd/adlcp_rootv1p2 adlcp_rootv1p2.xsd">
  <metadata>
    <schema>ADL SCORM</schema>
    <schemaversion>1.2</schemaversion>
  </metadata>
  <organizations default="ORG-1">
    <organization identifier="ORG-1">
      <title>${title}</title>
      <item identifier="ITEM-1" identifierref="RES-1" isvisible="true">
        <title>${title}</title>
        <adlcp:masteryscore>100</adlcp:masteryscore>
      </item>
    </organization>
  </organizations>
  <resources>
    <resource identifier="RES-1" type="webcontent" adlcp:scormtype="sco" href="index.html">
${fileTags}
    </resource>
  </resources>
</manifest>
`
}
