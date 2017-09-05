(function () {
    const myInit = {
        method: 'GET',
        mode: 'cors',
        cache: 'default'
    };
    const available = document.getElementById('available');
    const filesNamesContainer = document.getElementById('filesNamesContainer');
    available.onclick = () => {
        var myHeaders = new Headers();
        fetch('http://localhost:3589/file/available', myInit)
            .then(res => res.json())
            .then(files => {
                files.forEach(f => {
                    const div = document.createElement('div');
                    const btn = document.createElement('a');
                    btn.style.paddingRight = '25px';

                    const btnSave = document.createElement('button');
                    btnSave.style.marginRight = '10px';
                    const btnResume = document.createElement('button');
                    const splitted = f.url.split('&');
                    btnSave.onclick = actionCallback('pause', splitted[splitted.length - 1]);
                    btnResume.onclick = actionCallback('resume', splitted[splitted.length - 1]);
                    btnSave.textContent = 'pause';
                    btnResume.textContent = 'resume';
                    btn.textContent = f.name;
                    btn.setAttribute('href', f.url);
                    btn.setAttribute('download', f.name);
                    div.appendChild(btn);
                    div.appendChild(btnSave);
                    div.appendChild(btnResume);
                    filesNamesContainer.appendChild(div);
                });
            })
            .catch(error => console.log(error));

    }

    function actionCallback(type, id) {
        return function () {
            fetch(`http://localhost:3589/file/pause?type=${type}&${id}`, myInit)
                .then(res => res.json())
                .then(res => console.log(res))
                .catch(error => console.log(error))
        }
    }

})()