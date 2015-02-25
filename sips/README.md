# Scala Improvement Process Documents

This directory contains the source of the SIP website, including all pending/finished/rejected SIPs and SLIPs.


## Migrating a SIP or SLIP to other states

To reject a SIP simply:

    git mv pending/_posts/{sip-file}  rejected/_posts/{sip-file}

To mark a SIP completed simply:

    git mv pending/_posts/{sip-file}  completed/_posts/{sip-file}

The process is the same for SLIPs, which are identical except for their layout
being slip instead of sip in the document header.
