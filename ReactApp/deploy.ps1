Add-PSSnapin Microsoft.SharePoint.Powershell -ErrorAction SilentlyContinue

Write-Host -ForegroundColor White "*************************"
Write-Host -ForegroundColor White "*************************"
Write-Host -ForegroundColor White "        From Scratch"
Write-Host -ForegroundColor White "Deploiement - First"
Write-Host -ForegroundColor White "*************************"
Write-Host -ForegroundColor White "*************************"

Write-Host -ForegroundColor White "Demarrage du deploiement"
Write-Host -ForegroundColor Yellow "Compilation du projet"

$WebURL = "http://your-tenant-SharePoint/"
$DocLibName = "SiteAssets"

function Deployement () {    
    Begin {
        npm run build
    }
    
    Process {
        Try {
            
            Start-Sleep -Seconds 2
            Write-Host -ForegroundColor Yellow "Renommage des fichiers"
            $file = Get-ChildItem .\build\static\js\ | Rename-Item -NewName { "main" + $_.Extension} -ErrorAction Stop
            $file.Dispose
            $file = Get-ChildItem .\build\static\css\ | Rename-Item -NewName { "main" + $_.Extension} -ErrorAction Stop
            $file.Dispose
            Start-Sleep -Seconds 2
        } Catch {
            Write-Host -ForegroundColor Red "Erreur sur le renommage des fichiers ou l'execution de NPM"
            Write-Host -ForegroundColor Red "Des erreurs sont survenues. Veuillez en parler a votre delivery manager"
            return
        }
    
        try {
            $Web = Get-SPWeb $WebURL -ErrorAction Stop
            $List = $Web.GetFolder($DocLibName) 
            $Files = $List.Files
    
            Write-Host -ForegroundColor Yellow "Upload index.html dans $DocLibName"
            $FilePath = ".\index.html"
            $FileName = $FilePath.Substring($FilePath.LastIndexOf("\")+1) 
            $File = Get-ChildItem $FilePath -ErrorAction Stop
            $shut = $Files.Add($DocLibName +"/" + $FileName,$File.OpenRead(), $true)
    
            Write-Host -ForegroundColor Yellow "Upload du CSS"
            $mylist = $Web.GetList($Web.Url + "/" + $DocLibName)
            try {
                $folder = $mylist.AddItem("", [Microsoft.SharePoint.SPFileSystemObjectType]::Folder, "css")
                $folder.Update();
            } catch { }

            $FilePath = ".\build\static\css\main.css"
            $FileName = $FilePath.Substring($FilePath.LastIndexOf("\")+1)
            $File = Get-ChildItem $FilePath -ErrorAction Stop
            $shut = $Files.Add($DocLibName +"/css/" + $FileName, $File.OpenRead(), $true) 
            $FilePath = ".\build\static\css\main.map"
            $FileName = $FilePath.Substring($FilePath.LastIndexOf("\")+1)
            $File = Get-ChildItem $FilePath -ErrorAction Stop
            $shut = $Files.Add($DocLibName +"/css/" + $FileName, $File.OpenRead(), $true) 
    
            Write-Host -ForegroundColor Yellow "Upload du JavaScript"
            try {
                $folder = $mylist.AddItem("", [Microsoft.SharePoint.SPFileSystemObjectType]::Folder, "js")
                $folder.Update();
            } catch { }
            $FilePath = ".\build\static\js\main.js"
            $FileName = $FilePath.Substring($FilePath.LastIndexOf("\")+1)
            $File = Get-ChildItem $FilePath -ErrorAction Stop
            $shut = $Files.Add($DocLibName +"/js/" + $FileName, $File.OpenRead(),$true) 
            $FilePath = ".\build\static\js\main.map"
            $FileName = $FilePath.Substring($FilePath.LastIndexOf("\")+1)
            $File = Get-ChildItem $FilePath -ErrorAction Stop
            $shut = $Files.Add($DocLibName +"/js/" + $FileName, $File.OpenRead(),$true) 
    
            $web.Dispose()
        } Catch {
            $ErrorMessage = $_.Exception.Message
            Write-Host -ForegroundColor Red "Impossible d'uploader les fichiers"
            Write-Host -ForegroundColor Red "Raison: $ErrorMessage"
            Write-Host -ForegroundColor Red "Des erreurs sont survenues. Veuillez en parler a votre delivery manager"
        }
    }
    End {
        Write-Host -ForegroundColor White "Fin du deploiement."
    }
}

Deployement