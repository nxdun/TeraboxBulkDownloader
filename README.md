# TbX - Terabox downloading API 🔫

- ⭐ Terabox - Bulk download, Single Download
- ⭐ A Backend Download Manager - Parrarel, Mulit Chunks, Fast
- ⭐ Local FTP - quick file transfer using same api
- Heavy Link fault tolerance, Logs failed actions with links, Backup Fetching Algorithm, Seperate endpoints for deleting archives/current downloads

## ENV init

- to add several apis to enviroment variables 
```
API1, API2, ...
```
## installing

- Default express installing method
```
npm install && npm start
```
## endpoints
⭐ get a single download link and download it locally
- parameters : `url` : append a single link to this parameter
```
GET : /
```


⭐ For given links generate download links in `links.txt` locally
- parameters : `url` : append single/many link to this parameter
```
GET : /u
```


⭐ pings the server (returns idle or busy)
```
GET : /ping
```


⭐ zips the `downloads` folder then initialize FTP with requester with created zip file
```
GET : /download
```


⭐ delets all content in download directory remotely
```
GET : /deldown
```


⭐ delets all created zip files and cancel FTP remotely
```
GET : /del
```


⭐ For given links download all the links in `downloads` path locally
- parameters : `url` : append single/many link to this parameter
- returns thmubnails as response
```
GET : /multi
```

