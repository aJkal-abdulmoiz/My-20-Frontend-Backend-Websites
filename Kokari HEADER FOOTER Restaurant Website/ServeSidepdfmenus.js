function downloadCusinePDF() {
    var pdfPath = 'Coursera 5YZD6ZTVSAKW.pdf';

    var link = document.createElement('a');
    link.href = pdfPath;
    link.download = 'menu.pdf';

    // Append the link to the body (required for Firefox)
    document.body.appendChild(link);

    // Trigger a click on the link
    link.click();

    // Remove the link from the body
    document.body.removeChild(link);
}