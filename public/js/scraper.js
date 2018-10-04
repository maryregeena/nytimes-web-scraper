const save=function(id){
    const article={
        title:$("#title-"+id).text(),
        link:$("#link-"+id).text()
    }
    console.log(article.title+" "+article.link);

    const settings = {
        "url": "/save",
        "method": "POST",
        "data":article
    }

    $.ajax(settings).done(function (response) {
            console.log(response._id);

            $("#btn-save-"+id).html("Saved")
            .attr("id","btn-save-"+id).attr("onClick","");
            $("#title-"+id).attr("id","title-"+response._id);
            $("#link-"+id).attr("id","link-"+response._id);

    });
}

const deleteArticle=function(id){
    console.log(id);
    const settings = {
        "url": "/delete/"+id,
        "method": "POST"
    }

    $.ajax(settings).done(function (response) {
          window.location.href="/saved";
    });
}