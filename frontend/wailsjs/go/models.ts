export namespace main {
	
	export class OpenFileResult {
	    filePath: string;
	    content: string;
	
	    static createFrom(source: any = {}) {
	        return new OpenFileResult(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.filePath = source["filePath"];
	        this.content = source["content"];
	    }
	}

}

