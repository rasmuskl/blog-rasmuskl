---
layout: post
title: "Check your backups – unexpected SQL Server VSS backup"
date: 2011-11-30 00:25:47
tags: [SQL Server]
---

Your backup is only as good as your last restore. I recently changed my backup strategy on my SQL Server 2008 from doing a full nightly backup to doing incremental nightly backups and only a full backup each week. SQL Server incremental backups base themselves on the last <u>full</u> backup. This is nice when you go to restore them since you will only need the full backup + the incremental backup, not any intermediary backups.

However, a few days back I wanted to check some queries on a larger dataset and decided to check my backups at the same time. Fetched full + incremental backups from the server and started the local restore:

``` sql
RESTORE DATABASE [testdb]
FROM DISK = N'C:\temp\full.wbak'
WITH FILE = 1, NORECOVERY, REPLACE

RESTORE DATABASE [testdb]
FROM DISK = N'C:\temp\incremental.bak'
WITH FILE = 1, RECOVERY
```

The first backup went through fine, but restoring the incremental backup resulted in the following error message: 

<font color="#ff0000">This differential backup cannot be restored because the database has not been restored to the correct earlier state.</font> 

SQL Server refused to restore my incremental database – this is only supposed to happen if there has been another full backup in between. I double checked the backups I had fetched, checked that I had the set up the new backups correctly and that the old backup job was gone. Everything seemed fine.

I then explored the backup history a bit further with a query adjusted from the one found in [this](http://blog.sqlauthority.com/2010/11/10/sql-server-get-database-backup-history-for-a-single-database/) post:

``` sql
SELECT TOP 10
s.database_name,
m.physical_device_name,
s.backup_start_date
FROM msdb.dbo.backupset s
INNER JOIN msdb.dbo.backupmediafamily m ON s.media_set_id = m.media_set_id
WHERE s.database_name = DB_NAME() -- Remove this line for all the database
ORDER BY backup_start_date DESC
```

The result showed that there had indeed been backups in between my nightly runs:

<img src="/image_thumb_1.png" />

Further research revealed that backup devices with a GUID name are virtual backup devices and the times of backups matched the daily schedule of our bare metal system backup. Turns out that [R1Soft's backup software](http://www.r1soft.com/windows-cdp/) integrates with SQL Server’s VSS writer service to perform backups when it finds databases on disk.

Disabling the VSS writer service returned the backups to a working state (VSS backup + my own incremental would also have worked). I did consider skipping my own nightly backups (since the VSS backup is super fast) and just using the R1Soft one, but decided against it for now – my own management is already set up and if I do need to restore, grabbing the backup from the external backup is much slower and more tedious than having it on disk already.

